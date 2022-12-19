import React from 'react';
import DetailsPage from './DetailsPage';
import { cleanup, render } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    group: 'dummyGroup',
    postId: 'dummyPostId',
  }),
}));

jest.mock('../../utils/backendPosts', () => ({
  usePost: (group, postId) => ({
    author: 'mohamed',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mollis felis ligula, a pellentesque eros mattis eu. Nunc eu sem nisi. Pellentesque sit amet aliquam nisl, eu placerat purus. Integer quis semper nisl, ut interdum quam. Morbi posuere turpis ut nulla aliquet posuere. Mauris augue felis, congue a metus vitae, ultrices scelerisque libero. Sed et lectus luctus, tincidunt eros nec, tempor odio. In eget nibh sit amet nibh facilisis tempus. Integer lectus erat, accumsan sit amet eleifend ac, laoreet quis risus. Suspendisse porttitor ultrices lorem in hendrerit. Fusce semper velit sapien, non facilisis felis lacinia quis. Curabitur ex erat, mollis ut maximus eu, laoreet vitae leo. In porttitor tortor sit amet arcu fringilla, nec consequat felis fringilla.\n'
      + '\n'
      + 'Ut auctor, lorem sit amet malesuada mollis, risus eros efficitur magna, non dignissim massa diam a sem. Pellentesque vel justo sed ipsum varius congue vitae in arcu. Suspendisse vel efficitur velit. Cras tempus metus non nisl feugiat, vel ornare arcu vulputate. Pellentesque placerat sapien urna, nec tincidunt erat euismod et. Nunc ut lacinia nisl. Etiam sed ligula consectetur, rhoncus sapien vitae, varius nunc. Mauris aliquet pulvinar congue. Nunc sodales urna sed semper blandit. Quisque justo justo, posuere id nisl non, faucibus volutpat turpis. Aenean viverra mi eget lectus faucibus, at dapibus nisi maximus. Mauris finibus neque non massa ullamcorper, nec dapibus nunc finibus. Cras et nunc massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In sed ex sed dui malesuada porta.\n'
      + '\n'
      + 'Aliquam ac mattis nisl. Aliquam semper, urna eget aliquet faucibus, dui neque interdum turpis, eu viverra nibh arcu ut orci. Aliquam fringilla vestibulum augue fringilla euismod. Quisque tristique dignissim pretium. Nam placerat, nunc sed tincidunt ultrices, nisl elit dictum metus, at iaculis odio felis et lorem. Aenean malesuada magna eu diam pellentesque consectetur. Aliquam vel fermentum lacus. In hac habitasse platea dictumst.',
    comments: [
      {
        user: {
          pfp: `${process.env.PUBLIC_URL}/logo192.png`,
          name: 'Jackson',
        },
        text: 'Ut ut imperdiet lectus, tincidunt malesuada libero. Nulla et libero orci. Suspendisse semper id neque eget dignissim. Morbi metus justo, luctus nec velit in, condimentum ornare lorem. Pellentesque ac ipsum elit. Duis pulvinar tincidunt dui in iaculis. Aliquam erat volutpat. Nullam dictum id lacus non luctus. Etiam nisl quam, sagittis sed consequat vitae, luctus a orci.',
      },
      {
        user: {
          pfp: `${process.env.PUBLIC_URL}/logo192.png`,
          name: 'Jackson',
        },
        text: 'Ut ut imperdiet lectus, tincidunt malesuada libero. Nulla et libero orci. Suspendisse semper id neque eget dignissim. Morbi metus justo, luctus nec velit in, condimentum ornare lorem. Pellentesque ac ipsum elit. Duis pulvinar tincidunt dui in iaculis. Aliquam erat volutpat. Nullam dictum id lacus non luctus. Etiam nisl quam, sagittis sed consequat vitae, luctus a orci.',
      },
      {
        user: {
          pfp: `${process.env.PUBLIC_URL}/logo192.png`,
          name: 'Jackson',
        },
        text: 'Ut ut imperdiet lectus, tincidunt malesuada libero. Nulla et libero orci. Suspendisse semper id neque eget dignissim. Morbi metus justo, luctus nec velit in, condimentum ornare lorem. Pellentesque ac ipsum elit. Duis pulvinar tincidunt dui in iaculis. Aliquam erat volutpat. Nullam dictum id lacus non luctus. Etiam nisl quam, sagittis sed consequat vitae, luctus a orci.',
      },
      {
        user: {
          pfp: `${process.env.PUBLIC_URL}/logo192.png`,
          name: 'Jackson',
        },
        text: 'Ut ut imperdiet lectus, tincidunt malesuada libero. Nulla et libero orci. Suspendisse semper id neque eget dignissim. Morbi metus justo, luctus nec velit in, condimentum ornare lorem. Pellentesque ac ipsum elit. Duis pulvinar tincidunt dui in iaculis. Aliquam erat volutpat. Nullam dictum id lacus non luctus. Etiam nisl quam, sagittis sed consequat vitae, luctus a orci.',
      },
      {
        user: {
          pfp: `${process.env.PUBLIC_URL}/logo192.png`,
          name: 'Jackson',
        },
        text: 'Ut ut imperdiet lectus, tincidunt malesuada libero. Nulla et libero orci. Suspendisse semper id neque eget dignissim. Morbi metus justo, luctus nec velit in, condimentum ornare lorem. Pellentesque ac ipsum elit. Duis pulvinar tincidunt dui in iaculis. Aliquam erat volutpat. Nullam dictum id lacus non luctus. Etiam nisl quam, sagittis sed consequat vitae, luctus a orci.',
      },
    ],
    avatar: `${process.env.PUBLIC_URL}/logo192.png`,
    title: 'This is a post',
    full: true,
    tags: ['Tech', 'Finance', 'Art'],
  }),
}));

afterEach(cleanup);

test('basic snapshot', () => {
  const { asFragment } = render(DetailsPage());
  expect(asFragment())
    .toMatchSnapshot();
});
