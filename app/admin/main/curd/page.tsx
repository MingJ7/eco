"use client"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"

export default function Component() {
  const router = useRouter()
  // Handles the submit event on form submit.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
        
        // Get data from the form.
        const form = event.target as HTMLFormElement
        const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement
        submitBtn.disabled = true
        const data = {
          enName: form.enName.value,
          cnName: form.cnName.value,
          cost: form.cost.value,
          imgB64: (document.getElementById("imagePreview") as HTMLCanvasElement).toDataURL("image/jpeg", 0.5)
        }

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/admin/main'

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
        console.log(data)
        if (response.status == 200){
          const result = await response.json()
          console.log(result)
          router.push("/admin/main")
        }
        else alert('An error has occured')
        submitBtn.disabled = false
        console.log("function has ended")
      }

  const imageChange = function(event: any) {
    const imgg = new Image()
    imgg.src = URL.createObjectURL(event.target.files[0])
    imgg.onload = () => {
      const previewCanvas = document.getElementById("imagePreview") as HTMLCanvasElement
      previewCanvas.hidden = false
      previewCanvas.getContext("2d")?.drawImage(imgg, 0, 0, imgg.width, imgg.height, 0, 0, 256, 256)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <table className="form-table">
          <tbody>
            <tr>
              <td><label className="form-label" htmlFor="enName">English name:</label></td>
              <td><input type="text" id="enName" name="enName" className="form-input"/></td>
            </tr>
            <tr>
              <td><label className="form-label" htmlFor="cnName">Chinese name:</label></td>
              <td><input type="text" id="cnName" name="cnName" /></td>
            </tr>
            <tr>
              <td><label className="form-label" htmlFor="cost">cost:</label></td>
              <td><input type="number" id="cost" name="cost"  step="any"/></td>
            </tr>
            <tr>
              <td><label className="form-label" htmlFor="itemImage">Image:</label></td>
              <td><input type="file" id="itemImage" name="itemImage" accept="image/*" onChange={imageChange}></input></td>
            </tr>
            <tr><td></td><td>
              <canvas id="imagePreview" height={256} width={256} hidden></canvas>
            </td></tr>
          </tbody>
        </table>
        <button id="submit-btn" className="btn-sm green" type="submit">Submit</button>
      </form>
    </div>
  )
}
