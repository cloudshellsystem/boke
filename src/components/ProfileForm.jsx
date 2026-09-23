import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [photographe, setPhotographe] = useState('');

  const handleUpload = async () => {
    if (!file) {
      alert('Choisissez une photo');
      return;
    }

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const { data } = supabase.storage
      .from('photos')
      .getPublicUrl(fileName);

    const { error } = await supabase
      .from('photos')
      .insert([
        {
          titre,
          description,
          photographe,
          image_url: data.publicUrl,
          publiee: true
        }
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert('Photo publiée avec succès');

    setTitre('');
    setDescription('');
    setPhotographe('');
    setFile(null);

    if (onUploaded) onUploaded();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nom du photographe"
        value={photographe}
        onChange={(e) => setPhotographe(e.target.value)}
      />

      <input
        type="text"
        placeholder="Titre"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>
        Publier la photo
      </button>
    </div>
  );
}
