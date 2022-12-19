import { Redirect, Route } from 'react-router-dom';
import { useLoggedInUser } from '../../utils/backendUsers';

const PrivateRoute = ({
  path,
  exact,
  component
}) => {
  const user = useLoggedInUser();
  if (user === null || user) {
    return <Route path={path} exact={exact} component={component}/>;
  } else {
    return <Redirect to="/"/>;
  }
};

export default PrivateRoute;
