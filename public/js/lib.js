// Initialize Firebase
var config = {
  apiKey: "AIzaSyDbBjXOLuweRFjgN7tJTEiO_TswPjRkONU",
  authDomain: "forum-for-student.firebaseapp.com",
  databaseURL: "https://forum-for-student.firebaseio.com",
  projectId: "forum-for-student",
  storageBucket: "forum-for-student.appspot.com",
  messagingSenderId: "861870829993"
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

function urlparam(param) {
  var url = new URL(window.location);
  var c = url.searchParams.get(param);
  return c;
}

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

//load all data
async function getAllTopicData() {
  var querySnapshot = await db.collection('topic').get()
  var res = {};
  querySnapshot.forEach(function(doc) {
    res[doc.id] = doc.data()
  })
  return res;
}

//new topic
async function newTopic(title,text) {
  await db.collection("topic").add({
    "topic": title,
    "comment": [],
    "content": {
      "like": 0,
      text: text,
      owner: 1
    }
  });
}

var data;

async function getAllComment() {
  return;
}

//int main()
(async function() {
  //cache all data in a variable, so it easy to use
  data = await getAllTopicData();

  main();
})();