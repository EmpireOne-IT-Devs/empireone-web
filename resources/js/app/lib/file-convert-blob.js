export default async function file_convert_blob(file) {
    // Return null if input is missing or not a File/Blob
    if (!file || !(file instanceof Blob)) return null;

    const reader = new FileReader();

    const result = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result); // Base64 string
        reader.onerror = reject;
        reader.readAsDataURL(file); // Must be a Blob or File
    });

    return result;
}
