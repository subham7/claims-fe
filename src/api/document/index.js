import { MAIN_API_URL } from "../index";

export const createDocument = async (jsonData) => {
  // storing admin's document details

  try {
    const res = await fetch(`${MAIN_API_URL}document`, {
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
  try {
    const res = await fetch(`${MAIN_API_URL}document/club/${clubId}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const sentFileByEmail = async (formData) => {
  try {
    const res = await fetch(`${MAIN_API_URL}document/email`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
