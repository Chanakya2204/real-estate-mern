import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice.js';
const Profile = () => {
  const fileRef = useRef(null)
  const { currentUser, error, loading } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [fileperc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch();
  const [updateSucess, setUpdatSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress));
    },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) => setFormData({ ...formData, avatar: downloadURL }))
      }
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdatSuccess(true);
      setTimeout(() => {
        setUpdatSuccess(false);
      }, 2000)
    } catch (e) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess())
    } catch (e) {
      dispatch(deleteUserFailure(e.message));
    }
  }

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess())
    } catch (e) {
      dispatch(signOutUserFailure(e.message));
    }
  }

  const handleShowListings = async () => {
    setShowListingsError(false);
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data =await res.json();
      if (data.success === false) {
        setShowListingsError(true);
      }

      setUserListings(data);
    } catch (e) {
      setShowListingsError(true);
    }
  }
console.log(userListings);
  const handleListingDelete = async (listingId)=>{
      try {
        const res=await fetch(`/api/listing/delete/${listingId}`,{
          method:'DELETE',
        });
        const data=await res.json();
        if(data.success === false){
          console.log(data.message);
          return;
        }
        setUserListings((prev)=>prev.filter((listing)=> listing._id !== listingId));
      } catch (error) {
          console.log(e.message);
      }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4' >
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()}
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center'
          src={formData?.avatar || currentUser.avatar} alt={currentUser.name} />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : fileperc > 0 && fileperc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${fileperc}%`}</span>
          ) : fileperc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input type="text" onChange={handleChange} placeholder='username' defaultValue={currentUser.username} className='border p-3 rounded-lg' id='username' />
        <input type="email" onChange={handleChange} placeholder='email' defaultValue={currentUser.email} className='border p-3 rounded-lg' id='email' />
        <input type="password" onChange={handleChange} placeholder='enter new password' className='border p-3 rounded-lg' id='password' />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95
          disabled:opacity-80'>{loading ? 'Loading ...' : 'Update'}</button>
        <Link className='bg-green-700 uppercase text-white p-3 rounded-lg text-center hover:opacity-95' to='/create-listing'>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignout} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSucess && 'User is updated successfully!'}</p>
      <button onClick={handleShowListings} className='text-green-700 w-full '>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listings' : ''}</p>
      {userListings && userListings.length > 0 &&
          <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
{          userListings.map((listing) => {
          return <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
            <div className='flex items-center justify-center gap-2'>
            <Link to={`/listing/${listing._id}`}><img src={listing.imageUrls[0]} alt="listing cover"
            className='h-20 w-20 object-contain' /></Link>
            <Link to={`/listing/${listing._id}`}><p className='text-slate-700 font-semibold flex-1
            hover:underline truncate'>{listing.name}</p></Link>
            </div>
            <div className='flex flex-col items-center'>
                <button onClick={()=>{handleListingDelete(listing._id)}} className='text-red-700 uppercase'>Delete</button>
                <Link to={`/update-listing/${listing._id}`}><button className='text-green-700 uppercase'>Edit</button></Link>
            </div>
          </div>
        })}
          </div>
        }
    </div>
  )
}

export default Profile