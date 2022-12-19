import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import Post from '../common/post';
import { getSpecificPost } from '../../utils/backendPosts';

const DetailsContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const DetailsPageWrapper = styled.div`
  margin: 100px 0;
  flex-direction: column;
  padding-top: 20px;
  display: flex;
  align-items: center;
  width: 80%;
`;

const DetailsPage = () => {
  const { id } = useParams();
  const [fetchedPost, setFetchedPost] = useState(null);
  const [change, setChange] = useState(false);
  const history = useHistory();
  const publishChange = () => {
    setChange(!change);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSpecificPost(id);
        res.detailed = true;
        setFetchedPost(res);
      } catch (err) {
        history.push('/main');
      }
    };
    fetchData();
  }, [change, history, id]);

  //postData = usePost(1, 1);
  return (
    <DetailsPageWrapper>
      <DetailsContent>
        {fetchedPost ?
          <>

            <Post post={fetchedPost} publishChange={publishChange}/>
          </> :
          <>
            Loading...
          </>
        }
      </DetailsContent>
    </DetailsPageWrapper>
  );
};

export default DetailsPage;
