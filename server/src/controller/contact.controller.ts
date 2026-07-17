import { type Request, type Response } from "express";
import Contact from "../models/contact.model.ts";
import userRepository from "../repositories/user.repository.ts";

class ContactController {
  async listContacts(req: Request & { user?: any }, res: Response) {
    try {
      const ownerId = Number(req.user?.id);
      const contacts = await Contact.find({
        $or: [{ ownerId }, { sharedWithMe: ownerId }],
      }).sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: contacts });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch contacts." });
    }
  }

  async getContact(req: Request & { user?: any }, res: Response) {
    try {
      const ownerId = Number(req.user?.id);
      const contact = await Contact.findOne({
        _id: req.params.id,
        $or: [{ ownerId }, { sharedWithMe: ownerId }],
      });

      if (!contact) {
        return res
          .status(404)
          .json({ success: false, message: "Contact not found." });
      }

      res.status(200).json({ success: true, data: contact });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch contact." });
    }
  }

  async createContact(req: Request & { user?: any }, res: Response) {
    try {
      const ownerId = Number(req.user?.id);
      const payload = req.body;

      const contact = await Contact.create({
        ownerId,
        firstName: payload.firstName,
        lastName: payload.lastName,
        contactNumber: payload.contactNumber,
        email: payload.email,
        profilePhoto: payload.profilePhoto,
        sharedWithMe: [],
      });

      res.status(201).json({ success: true, data: contact });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to create contact." });
    }
  }

  async updateContact(req: Request & { user?: any }, res: Response) {
    try {
      const ownerId = Number(req.user?.id);
      const contact = await Contact.findOne({ _id: req.params.id, ownerId });

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found or not owned by you.",
        });
      }

      const updates = req.body;
      Object.assign(contact, updates);
      await contact.save();

      await Contact.updateMany(
        {
          _id: { $ne: contact._id },
          ownerId: { $ne: ownerId },
          sharedWithMe: ownerId,
        },
        { $set: updates },
      );

      res.status(200).json({ success: true, data: contact });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update contact." });
    }
  }

  async deleteContact(req: Request & { user?: any }, res: Response) {
    try {
      const ownerId = Number(req.user?.id);
      const contact = await Contact.findOne({ _id: req.params.id, ownerId });

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found or not owned by you.",
        });
      }

      await contact.deleteOne();
      res
        .status(200)
        .json({ success: true, message: "Contact deleted successfully." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete contact." });
    }
  }

  async shareContact(req: Request & { user?: any }, res: Response) {
    try {
      const ownerId = Number(req.user?.id);
      const shareWithUserId = Number(req.body.userId);
      const contact = await Contact.findOne({ _id: req.params.id, ownerId });

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found or not owned by you.",
        });
      }

      const targetUser = await userRepository.fetchUser(shareWithUserId);
      if (
        !targetUser ||
        (Array.isArray(targetUser) && targetUser.length === 0)
      ) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      if (!contact.sharedWithMe.includes(shareWithUserId)) {
        contact.sharedWithMe.push(shareWithUserId);
        await contact.save();
      }

      res
        .status(200)
        .json({ success: true, message: "Contact shared successfully." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to share contact." });
    }
  }

  async unshareContact(req: Request & { user?: any }, res: Response) {
    try {
      const ownerId = Number(req.user?.id);
      const shareWithUserId = Number(req.body.userId);
      const contact = await Contact.findOne({ _id: req.params.id, ownerId });

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found or not owned by you.",
        });
      }

      contact.sharedWithMe = contact.sharedWithMe.filter(
        (id) => id !== shareWithUserId,
      );
      await contact.save();

      res
        .status(200)
        .json({ success: true, message: "Contact unshared successfully." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to unshare contact." });
    }
  }
}

export default new ContactController();
