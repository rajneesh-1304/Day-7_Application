import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './register.css'
import { email, nanoid, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Fragment, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { handleCurrentUser } from '../../redux/slice/slice'
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { auth, provider, db } from '../../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';


const RegisterUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .regex(/^[A-Za-z ]+$/, "Name can only contain letters and spaces"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters")
    .regex(/^\S*$/, "Password cannot contain spaces")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[!@#$%^&*]/, "Must contain at least one special character"),
});


type RegisterFormInputs = z.infer<typeof RegisterUserSchema>;

export default function RegisterForm() {
  const users = useSelector((state: { users: { users: RegisterFormInputs[] } }) => state.users.users);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword(prev => !prev);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/');
  }
  const handleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(doc(db, 'auth', user.uid), {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      isOnline: true, 
      createdAt: serverTimestamp(),
    });

   dispatch(handleCurrentUser({
  id: user.uid,
  name: user.displayName || 'User',
  email: user.email || '',
  photoUrl: user.photoURL || null,
}));


    setSnackbarMessage('User Registered successfully!');
    setSnackbarOpen(true);

    setTimeout(() => navigate('/chat'), 1200);
  } catch (error) {
    setSnackbarMessage('User not registered');
    setSnackbarOpen(true);
  }
};



 const onSubmit = async (data: RegisterFormInputs) => {
  try {
    const userr = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const firebase = userr.user;

    await setDoc(doc(db, 'auth', firebase.uid), {
      id: firebase.uid,
      name: data.name,
      email: firebase.email,
      photoURL: null,
      isOnline: true, 
      createdAt: serverTimestamp(),
    });

    dispatch(handleCurrentUser({
  id: firebase.uid,
  name: data.name,
  email: firebase.email || '',
  photoUrl: null,
}));


    setSnackbarMessage('User created successfully!');
    setSnackbarOpen(true);

    setTimeout(() => navigate('/'), 1200);
  } catch (error) {
    setSnackbarMessage('User already exists');
    setSnackbarOpen(true);
  }
};


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  useEffect(() => {
    console.log(users)
  }, [users])
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: 300,
            gap: 2,
          }}
        >

          <Button variant="contained" sx={{ mt: 2,  borderRadius:'1000px' }} onClick={handleSignIn}>
            Sign in With Google
          </Button>
          <div style={{ display: 'flex', width: 100, gap: 2, }}>
            <span> <hr style={{backgroundColor: 'gray', height: '1px', width: 150}}/></span>
            <span>or</span>
            <span> <hr style={{backgroundColor: 'gray', height: '1px', width: 150}}/></span>
          </div>
          <FormControl variant="standard">
            <TextField
              label="Name"
              variant="outlined"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ''}
            />
          </FormControl>

          <FormControl variant="standard">
            <TextField
              label="Email"
              variant="outlined"
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
            />
          </FormControl>

          <FormControl variant="standard" fullWidth>
      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        {...register('password', { required: 'Password is required' })}
        error={!!errors.password}
        helperText={errors.password ? errors.password.message : ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </FormControl>

          <Button variant="contained" sx={{ mt: 2 }} type="submit" >
            Register
          </Button>
        </Box>
      </form>

      <div
        className='login'><p>Already Registered <span className='login_link' onClick={handleLogin}>Login</span></p></div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message={snackbarMessage}
      />
    </div>
  );
}
