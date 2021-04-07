import app from 'flarum/app';
import { extend } from 'flarum/extend';
import PostUser from 'flarum/components/PostUser';
import UserCard from 'flarum/components/UserCard';
import Link from 'flarum/components/Link';

function matchTag(tag) {
  return node => node && node.tag && node.tag === tag;
}

function matchClass(className) {
  // trim() to handle classNames that end with spaces easier
  return node => node && node.attrs && node.attrs.className && node.attrs.className.trim() === className;
}

function applyColor(vdom, user) {
  // Find the first group that has a color
  // We don't read badges because we would need to support every badge component and its attrs
  const firstColoredGroup = user.groups().find(group => {
    return group.color();
  });

  // If there are no color groups, skip
  if (!firstColoredGroup) {
    console.log('No colour');
    return;
  }

  console.log(vdom);

  console.log(firstColoredGroup.color());

  vdom.attrs = vdom.attrs || {};
  vdom.attrs.style = vdom.attrs.style || {};
  vdom.attrs.style.color = firstColoredGroup.color();
}

app.initializers.add('mickmelon-coloured-usernames', () => {
  extend(PostUser.prototype, 'view', function (vnode) {
    const user = this.attrs.post.user();

    // If the post belongs to a deleted user, skip
    if (!user) {
      return;
    }

    const avatar = vnode.children.find(matchTag('h3'))
      .children.find(matchTag(Link))
      .children.find(matchClass('username'));

    applyColor(avatar, user);
  });

  extend(UserCard.prototype, 'view', function (vnode) {
    const username = vnode.children.find(matchClass('darkenBackground'))
      .children.find(matchClass('container'))
      .children.find(matchClass('UserCard-profile'))
      .children.find(matchClass('UserCard-identity'))
      .children.find(matchClass('username'));

      applyColor(username, this.attrs.user);
  });
});
