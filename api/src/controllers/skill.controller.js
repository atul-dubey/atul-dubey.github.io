const Skill = require("../models/Skill");
const { uploadBase64 } = require("../services/cloudinary.service");

// 1. Get All Skills
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 2. Create Skill
exports.createSkill = async (req, res) => {
  try {
    const { title, description, icon, order } = req.body;

    let iconUrl = icon;
    if (icon) {
      iconUrl = await uploadBase64(icon, "atul_portfolio/skills");
    }

    const newSkill = await Skill.create({ title, description, icon: iconUrl, order });
    res.status(201).json(newSkill);
  } catch (err) {
    res.status(400).json({ message: "Error creating skill", error: err.message });
  }
};

// 3. Update Skill
exports.updateSkill = async (req, res) => {
  try {
    const { title, description, icon, order } = req.body;
    const updates = { title, description, order };

    // Update icon if provided (supports both file paths and base64)
    if (icon) {
      updates.icon = await uploadBase64(icon, "atul_portfolio/skills");
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    res.status(200).json(updatedSkill);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// 4. Delete Skill
exports.deleteSkill = async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 5. Get Single Skill (For Edit)
exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.status(200).json(skill);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};