import React from 'react';
import { Spinner, Container, Row, Col } from 'react-bootstrap';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs="auto" className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">{message}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Loading;
