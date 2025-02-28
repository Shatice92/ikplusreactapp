import { Row, Col } from "antd";
import { Slide } from "react-awesome-reveal";
import { withTranslation } from "react-i18next";
import styled from "styled-components";


import CommentContent from "../../content/CommentContent.json";

const TestimonialsContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background-color: #f9f9f9;
  border-radius: 5px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Testimonials = () => {
  return (
    <Row justify="center" align="middle" id="comment">
      <Col span={24}>
        <Slide direction="up" triggerOnce>
          <h2>{CommentContent.title}</h2>
          <p>{CommentContent.text}</p>
          <TestimonialsContainer>
            {CommentContent.comments.map((comment, index) => (
              <CommentItem key={index}>
                <Avatar src={comment.userImageUrl} alt="User" />
                <div>
                  <p><strong>{comment.comment}</strong></p>
                  <small>⭐ {comment.rating} - {new Date(comment.createdAt).toLocaleDateString()}</small>
                </div>
              </CommentItem>
            ))}
          </TestimonialsContainer>
        </Slide>
      </Col>
    </Row>
  );
};

export default withTranslation()(Testimonials);
