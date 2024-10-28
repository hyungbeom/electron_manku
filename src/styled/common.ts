import styled from "styled-components";

export const DropArea = styled.div`
  width: 100%;
  border: 2px dashed #1890ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props:any) => (props?.isDragActive ? '#f0f5ff' : '#fafafa')};
  transition: background-color 0.3s ease;
  cursor: pointer;
`;