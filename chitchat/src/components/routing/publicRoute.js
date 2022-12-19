import { Redirect, Route } from 'react-router-dom';
import { useLoggedInUser } from '../../utils/backendUsers';

const PublicRoute = ({
  path,
  exact,
  component
}) => {
  const user = useLoggedInUser();
  return user ? (
    <Redirect to="/main"/>
  ) : (
    <Route path={path} exact={exact} component={component}/>
  );
};

export default PublicRoute;
