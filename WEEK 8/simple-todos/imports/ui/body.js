// import { Template } from 'meteor/templating';
 
// import './body.html';
 
// Template.body.helpers({
//   tasks: [
//     { text: 'This is task 1' },
//     { text: 'This is task 2' },
//     { text: 'This is task 3' },
//   ],
// });
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';
 
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {

    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks

    // return Tasks.find({});
    return Tasks.find({}, { sort: { createdAt: -1 } });  // Show newest tasks at the top
  },
    incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
 
    // Insert a task into the collection
    Meteor.call('tasks.insert', text);
    // Tasks.insert({
    //   text,
    //   createdAt: new Date(), // current time
    //   owner: Meteor.userId(),
    //   username: Meteor.user().username,      
    // });
 
    // Clear form
    target.text.value = '';
  },
    'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },

    // console.log(event) // see all of the other properties of the event object
    //                    // and inspect in browser
});