import { useState } from 'react'
import ScoreParser from './ScoreParser';
import sharp from 'sharp';

// todo scrap this and just parse from stats.xml

function ScoreUpload() {  
  const [selectedImage, setSelectedImage] = useState<string>('');
  const handleImageUpload = (event: any) => {
    const image = URL.createObjectURL(event.target.files[0]);
	setSelectedImage(image);
	console.log(image)
	/*sharp(image)
		.resize({width: 1920})
		.png()
		.toFile('output.png')
		.then(() => {
			setSelectedImage('./output.png')
		});*/
  };

  return (
    <>
      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {selectedImage && <img src={selectedImage} className="img" alt="Selected" />}
        <ScoreParser img = {selectedImage} />
      </div>
    </>
  )
}

export default ScoreUpload
