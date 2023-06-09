import { Button, TextField, Typography, Grid, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const AppContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 300px;
  margin-bottom: 16px;
`;

export const ButtonContainer = styled(Box)`
  display: flex;
  gap: 16px;
`;