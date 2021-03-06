Router.map(function() {
  this.route('reactivity', {
    path: '/features/reactivity'
  });
});

Template.nameSliderValue.events({
  'input input': function(event, tpl) {
    var $target = $(event.target);
    var name = $target.attr('name');
    var value = $target.val();

    if (Session.get('modRender') === 'instant' || name === 'width')
      Session.set(name, parseFloat(value));
  },
  'change input': function(event, tpl) {
    var $target = $(event.target);
    var name = $target.attr('name');
    var value = $target.val();

    if (Session.get('modRender') !== 'instant' || name !== 'width')
      Session.set(name, parseFloat(value));
  }
});

/* GridView */

Session.setDefault('width', 350);
Template.reactivity.helpers({
  gridSize: function() {
    /*
    return {
      value: [ Session.get('width'), 100 ],
      transition: { duration: 1000, curve: 'easeOut' }
    }
    */

    /*
    var SpringTransition = famous.transitions.SpringTransition;
    return {
      value: [ Session.get('width'), 100 ],
      transition: { method: SpringTransition, period: 800, dampingRatio: 0.2, velocity: 0.01 }
    };
    */

    return [ Session.get('width'), 100 ];
  },
  gridDimensions: function() {
    return [ Math.ceil(Session.get('width') / 234), 1 ];
  },

  // StateModifier
  getSize: function() {
    return [ Session.get('sizeX'), Session.get('sizeY') ];
  }
});

/* StateModifier + Session stuff used by GridView */

Session.setDefault('skewX', 0); Session.setDefault('skewY', 0);
Session.setDefault('sizeX', 100); Session.setDefault('sizeY', 100);
Session.setDefault('rotateX', 0); Session.setDefault('rotateY', 0);
Session.setDefault('rotateZ', 0);

var sess = {};
var props = [
  'skewX', 'sizeX', 'skewY', 'sizeY',
  'rotateX', 'rotateY', 'rotateZ',
  'modTransHalt',
  'width' /* gridLayout */
];
_.each(props, function(prop) {
  sess[prop] = function() { return Session.get(prop); };
});
Template.reactivity.helpers({sess:sess});
Template.reactivityModState.helpers({sess:sess});

Template.reactivityModState.events({
  'change [name=render]': function(event) {
    Session.set('modRender', $(event.target).val());
  },
  'change [name=halt]': function(event) {
    Session.set('modTransHalt', $(event.target).is(':checked'));
  }
});

Session.setDefault('modRender', 'transition');
Template.reactivityModState.helpers({
  renderType: function(value) {
    return Session.get('modRender') == value;
  }
});

Template.reactivityModState.rendered = function() {
  this.autorun(function() {
    if (Session.get('modRender') == 'instant') {
      delete FView.byId('block').modifierTransition;
    } else {
      FView.byId('block').modifierTransition =
        { curve: 'easeIn', duration: 1000 };
    }
  });
  this.autorun(function() {
    FView.byId('block')
      .modifierTransitionHalt = Session.get('modTransHalt');
  });
};
