"use client"
import { FormEvent } from "react"

export default function Component() {
  // Handles the submit event on form submit.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        console.log(event)
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
        
        // Get data from the form.
        const form = event.target as HTMLFormElement
        const data = {
          enName: form.enName.value,
          cnName: form.cnName.value,
          type: form.type.value,
          cost: form.cost.value,
          imgB64: (document.getElementById("imagePreview") as HTMLCanvasElement).toDataURL("image/jpeg", 0.5)
        }

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/admin/side'

        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: 'PUT',
          // Tell the server we're sending JSON.
          headers: {
            'Content-Type': 'application/json',
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata,
        }

        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options)

        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        if (response.status == 200){
          const result = await response.json()
          console.log(result)
          alert('data sent properly')
        }
        else alert('An error has occured')
        console.log("function has ended")
      }

  const imageChange = function(event: any) {
    const imgg = new Image()
    imgg.src = URL.createObjectURL(event.target.files[0])
    imgg.onload = () => {
      const previewCanvas = document.getElementById("imagePreview") as HTMLCanvasElement
      previewCanvas.getContext("2d")?.drawImage(imgg, 0, 0, imgg.width, imgg.height, 0, 0, 256, 144)
    }
  }
    
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="enName">English name:</label>
        <input type="text" id="enName" name="enName" />
        <br />
        <label htmlFor="cnName">Chinese name:</label>
        <input type="text" id="cnName" name="cnName" />
        <br />
        <label htmlFor="type">type:</label>
        <input type="text" id="type" name="type" />
        <br />
        <label htmlFor="cost">cost:</label>
        <input type="number" id="cost" name="cost" step="any"/>
        <br />
        <label htmlFor="itemImage">Image:</label>
        <input type="file" id="itemImage" name="itemImage" accept="image/*" onChange={imageChange}></input>
        <br/>
        <canvas id="imagePreview" height={144} width={256}></canvas>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
