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

var data,rooms=[];
var auth_email,auth_uid;
var isadmin = false;
var topic_by_room = {};
var hottopics = [];
var dataarr = [];

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
    res[doc.id]['id'] = doc.id;
  })
  return res;
}

//new topic
async function newTopic(title,text,roomid) {
  if (auth_uid) {
    await db.collection("topic").add({
      "topic": title,
      "comment": [],
      "content": {
        "like": 0,
        text: text,
        owner: auth_uid
      },
      room:roomid
    });
  } else {
    throw "Need to login";
  }
}

//like topic
async function likeTopic(id) {
  data[id].content.like++;
  await db.collection("topic").doc(id).set(data[id]);
}

//like comment
async function likeComment(id,commentid) {
  data[id].comment[commentid].like++;
  await db.collection("topic").doc(id).set(data[id]);
}

//new comment
async function newComment(id,text) {
  if (auth_uid) {
    data[id].comment.push({
      owner: auth_uid,
      text: text,
      like: 0
    });
    await db.collection("topic").doc(id).set(data[id]);
  } else {
    throw "Need to login";
  }
}

async function getAllComment(id) {
  return data[id].comment;
}

//int main()
(async function() {
  //cache all data in a variable, so it easy to use
  data = await getAllTopicData();

  for(x in data) {
    dataarr.push(data[x]);
    if (data[x].room) {
      rooms.push(data[x].room);
      if (!topic_by_room[data[x].room]) topic_by_room[data[x].room] = {}
      topic_by_room[data[x].room][data[x].id] = data[x]
    } else {
      if (!topic_by_room["null"]) topic_by_room["null"] = {}
      topic_by_room["null"][data[x].id] = data[x]
    }
    rooms = $.unique(rooms);
  }
  
  hottopics = dataarr.slice();
  hottopics.sort((a,b)=>{
    return b.content.like-a.content.like;
  })
  hottopics = hottopics.slice(0,10);

  //init auth
  var ui = new firebaseui.auth.AuthUI(firebase.auth());

  ui.start('#firebaseui-auth-container', {
    signInOptions : [
      // List of OAuth providers supported.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
    // Other config options...
  });
  
  firebase.auth().onAuthStateChanged(async function(user) {
    window.vm_auth = new Vue({
      el: '#user-vue',
      data: {
        window: window
      }
    })
    
    if (user) {
      var email = user.email;
      var uid = user.uid;

      auth_email = email;
      auth_uid = uid;
    
      $("#email").text(email);
      $("#uid").text(uid);
      $("#firebaseui-auth-container").hide();
      
      vm_auth.$forceUpdate();

      

      //await init_countamount();

      loading = false;
      if (window.vm) vm.$forceUpdate();
    }
    
    if (window.main) main();
  });
})();