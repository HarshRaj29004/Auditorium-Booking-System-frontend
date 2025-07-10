export const Role = {
  SUPERADMIN: "SUPERADMIN",
  SUBADMIN: "SUBADMIN",
  USER: "USER",
};

export const RequestStatus = {
  PENDING: "PENDING",
  BOOKED: "BOOKED",
  FORWARD: "FORWARD",
  DECLINED: "DECLINED"
};

export const RequestType = {
  CLUB: "CLUB",
  TEACHER: "TEACHER",
};

export const userInfo = {
  EMAIL: localStorage.getItem('userEmail'),
  NAME: localStorage.getItem('name'),
  TOKEN: localStorage.getItem('authtoken'),
  ROLE: localStorage.getItem('role')
}