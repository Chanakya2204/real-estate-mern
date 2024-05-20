import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({listing}) => {
    const [landlord,setLandlord]=useState(null);
    const [message,setMessage]=useState('');

    const onChange =(e)=>{
        setMessage(e.target.value);
    }

    useEffect(()=>{
        const fetchLandlord = async ()=>{
            try {
                const res=await fetch(`/api/user/${listing.userRef}`);
                const data=await res.json();
                setLandlord(data);
            } catch (e) {
                console.log(e.message);
            }
        }
        fetchLandlord();
    },[listing.userRef]);

    console.log(landlord);
  return (
    <>
        {landlord && (
            <div className='flex flex-col gap-2'>
                    <p>Contact : <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                    <textarea className='w-full border p-3 rounded-lg mt-2' 
                    placeholder='Enter Your Message over here...' name="message" id="message" rows="2" value={message} onChange={onChange}></textarea>
                    <Link className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
                     to={`mailto:${landlord.email}?subject=Regarding${listing.name}&body=${message}`} onClick={()=>{
                       setTimeout(()=>{
                        setMessage('') 
                       },1000)
                     }}>Send Message</Link>
            </div>
        )}
    </>
  )
}

export default Contact