const Academic = require("../models/academic");

module.exports.academicData = async (req, res, next) => {
  try {
    const academic = await Academic.findOne({});
    res.status(200).json({ academic });
  } catch (error) {
    next(error);
  }
};

module.exports.updateAcademicData = async (req, res, next) => {
  try {
    const academic = await Academic.findOne({});
    console.log(academic);
    academic.subjects.push(req.body);
    academic.save();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.updateAcademicTopic = async (req, res, next) => {
  const { selectedClass, selectedSubject, newTopic } = req.body;

  try {
    const academic = await Academic.findOne({});

    const subjectIndex = academic.subjects.findIndex(
      (subject) => subject.name === selectedSubject
    );

    if (subjectIndex === -1) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const topic = {
      className: selectedClass,
      name: newTopic,
      subtopics: [],
    };

    academic.subjects[subjectIndex].topics.push(topic);

    await academic.save();

    res.status(200).json({ message: "New topic added successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.updateAcademicSubtopic = async (req, res, next) => {
  const { selectedClass, selectedSubject, selectedTopic, subtopic } = req.body;

  try {
    const academic = await Academic.findOne({});

    const subjectIndex = academic.subjects.findIndex(
      (subject) => subject.name === selectedSubject
    );

    if (subjectIndex === -1) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const topicIndex = academic.subjects[subjectIndex].topics.findIndex(
      (topic) =>
        topic.name === selectedTopic && topic.className === selectedClass
    );

    const newSubtopic = {
      name: subtopic,
    };

    academic.subjects[subjectIndex].topics[topicIndex].subtopics.push(
      newSubtopic
    );

    await academic.save();

    res.status(200).json({ message: "New Subtopic added successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.deleteTopic = async (req, res, next) => {
  const { className, name, topicId } = req.body;

  try {
    const academic = await Academic.findOne({});
    if (!academic) {
      return res.status(404).json({ message: "Academic data not found." });
    }

    const subjectIndex = academic.subjects.findIndex(
      (subject) => subject.name === name
    );

    if (subjectIndex === -1) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const topicIndex = academic.subjects[subjectIndex].topics.findIndex(
      (topic) => topic._id.toString() === topicId
    );

    if (topicIndex === -1) {
      return res.status(404).json({ message: "Topic not found." });
    }

    const abc = academic.subjects[subjectIndex].topics.splice(topicIndex, 1); // Remove the topic

    await academic.save();

    res.status(200).json({ message: "Topic deleted successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.deleteSubtopic = async (req, res, next) => {
  const { className, name, topicId, subtopicId } = req.body;

  try {
    const academic = await Academic.findOne({});
    if (!academic) {
      return res.status(404).json({ message: "Academic data not found." });
    }

    const subjectIndex = academic.subjects.findIndex(
      (subject) => subject.name === name
    );

    if (subjectIndex === -1) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const topicIndex = academic.subjects[subjectIndex].topics.findIndex(
      (topic) => topic._id.toString() === topicId
    );

    if (topicIndex === -1) {
      return res.status(404).json({ message: "Topic not found." });
    }

    const subtopicIndex = academic.subjects[subjectIndex].topics[
      topicIndex
    ].subtopics.findIndex((subtopic) => subtopic._id.toString() === subtopicId);

    academic.subjects[subjectIndex].topics[topicIndex].subtopics.splice(
      subtopicIndex,
      1
    );

    await academic.save();

    res.status(200).json({ message: "Subtopic deleted successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
