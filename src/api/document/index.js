import { MAIN_API_URL } from "../index";

export const createDocument = async (jsonData) => {
  // storing admin's document details

  try {
    const res = await fetch(`${MAIN_API_URL}/document`, {
      method: "POST",
      body: JSON.stringify(jsonData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

// get Documents by ClubID
export const getDocumentsByClubId = async (clubId) => {
  // return await axios.get(`${MAIN_API_URL}/club/${clubId}` )
  try {
    const res = await fetch(`${MAIN_API_URL}/document/club/${clubId}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const sentFileByEmail = async (formData) => {
  console.log("JSON DATA", formData);
  try {
    const res = await fetch(`${MAIN_API_URL}/document/email`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
