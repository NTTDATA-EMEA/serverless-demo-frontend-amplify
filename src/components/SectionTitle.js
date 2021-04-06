import styled from 'styled-components';

const Title = styled.p`
    margin-top: 10px
`;

export const SectionTitle = ({ title }) => (
    <Title>{title}</Title>
);