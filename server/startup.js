if (Meteor.isServer) {


    Meteor.startup(function () {
      // code to run on server at startup
      Meteor.publish('lectures', function() {
        return Lectures.find();
      });

      Meteor.publish('lecture', function(index) {
        return Lectures.find({index: index});
      });

      Meteor.publish('messages', function(currentLectureId) {
        return Messages.find({lecture: currentLectureId});
      });

      Meteor.publish('allUsers', function() {
        return Meteor.users.find({}, {
          fields: {
            'profile.email': 1,
            'profile.name': 1,
            'profile.createdAt': 1,
            'profile.adminFor': 1
          }
        });
      });

      if (Lectures.find().count() === 0) {
        var firstUser = Accounts.createUser({
          email: "pwh@outlook.com",
          password: "eecs111",
        });

        var secondUser = Accounts.createUser({
          email: "jon@outlook.com",
          password: "eecs211",
        });

        var thirdUser = Accounts.createUser({
          email: "nevil@outlook.com",
          password: "eecs212",
        });

        Lectures.insert({
          name: "EECS 111",
          index: CurrentIndex++,
          admin: firstUser
        });

        Lectures.insert({
          name: "EECS 211",
          index: CurrentIndex++,
          admin: secondUser
        });

        Lectures.insert({
          name: "EECS 212",
          index: CurrentIndex++,
          admin: thirdUser
        });
      };
    });

  Meteor.methods({
    createMessage: function(content, lectureId, presetType) {
      if (content != '') {
      Messages.insert({content: content,
        lecture: lectureId,
        presetType: presetType,
        timestamp: Date.now()});
      }
    },
    createMessageByButton: function(buttonId, lectureId) {
      if (buttonId == "lectureTooFast") {
        Messages.insert({ content: "You're going too fast", 
          lecture: lectureId, 
          presetType: "tooFast",
          timestamp: Date.now() });
      }
      else if (buttonId == "lectureTooSlow") {
        Messages.insert({ content: "You're going too slow", 
          lecture: lectureId, 
          presetType: "tooSlow",
          timestamp: Date.now() });
      }
      else if (buttonId == "goBackSlide") {
        Messages.insert({ content: "Can you go back a slide?", 
          lecture: lectureId, 
          presetType: "backSlide",
          timestamp: Date.now() });
      }
      else if (buttonId == "dontUnderstand") {
        Messages.insert({ content: "I don't understand", 
          lecture: lectureId, 
          presetType: "dontUnderstand",
          timestamp: Date.now() });
      }
      else {
        console.log("something");
      }
    },
    countMessagesByPresetType: function(lectureId, presetType) {
      Messages.find({lecture: lectureId, presetType: presetType}).count();
    },
    clearAll: function(lectureId) {
      Messages.remove({lecture: lectureId});
    }
  });
}