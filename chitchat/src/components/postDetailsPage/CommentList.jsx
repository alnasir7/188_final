import DetailComment from './DetailComment';

const CommentList = (props) => {
  const {
    comments,
    maxLength,
    maxLevel,
    avatar,
    publishChange,
  } = props;
  if (!maxLength && !maxLevel) {
    return (
      <div>
        {comments.map(
          (comment) => <DetailComment _id={comment._id} publishChange={publishChange}
                                      user={comment.user} author={comment.author}
                                      text={comment.text} avatar={avatar}/>,
        )}
      </div>
    );
  }
  return (
    <div/>
  );
};

export default CommentList;
