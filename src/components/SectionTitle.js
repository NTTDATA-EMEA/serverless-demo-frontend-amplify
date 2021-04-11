import styled from 'styled-components';
import PropTypes from 'prop-types';

const Title = styled.p`
    margin-top: 10px
`;

export const SectionTitle = ({ title }) => (
    <Title>{title}</Title>
);

SectionTitle.defaultProps = {
  title: "Default Title"
}

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired
}