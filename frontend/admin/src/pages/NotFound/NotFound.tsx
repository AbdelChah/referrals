import React from 'react';
import {Container, Header, Message, HomeLink} from './notFound.styles'

const NotFound: React.FC = () => {
  return (
    <Container>
      <Header>404 - Page Not Found</Header>
      <Message>Oops! The page you're looking for does not exist.</Message>
      <HomeLink to="/campaigns">Go to Home</HomeLink>
    </Container>
  );
};



export default NotFound;
