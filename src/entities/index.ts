/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: guests
 * Interface for Guests
 */
export interface Guests {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType date */
  dateOfBirth?: Date | string;
  /** @wixFieldType text */
  address?: string;
  /** @wixFieldType text */
  identificationNumber?: string;
  /** @wixFieldType text */
  specialRequests?: string;
}


/**
 * Collection ID: hotelservices
 * @catalog This collection is an eCommerce catalog
 * Interface for HotelServices
 */
export interface HotelServices {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  itemName?: string;
  /** @wixFieldType text */
  itemDescription?: string;
  /** @wixFieldType number */
  itemPrice?: number;
  /** @wixFieldType boolean */
  isAvailable?: boolean;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  itemImage?: string;
  /** @wixFieldType text */
  serviceDuration?: string;
}


/**
 * Collection ID: housekeepingtasks
 * Interface for HousekeepingTasks
 */
export interface HousekeepingTasks {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  taskDescription?: string;
  /** @wixFieldType text */
  roomNumber?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType text */
  assignedStaff?: string;
  /** @wixFieldType date */
  dueDate?: Date | string;
  /** @wixFieldType text */
  notes?: string;
}


/**
 * Collection ID: maintenancerequests
 * Interface for MaintenanceRequests
 */
export interface MaintenanceRequests {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  issueDescription?: string;
  /** @wixFieldType text */
  locationRoomNumber?: string;
  /** @wixFieldType text */
  priorityLevel?: string;
  /** @wixFieldType text */
  repairStatus?: string;
  /** @wixFieldType datetime */
  dateReported?: Date | string;
  /** @wixFieldType datetime */
  dateResolved?: Date | string;
}


/**
 * Collection ID: payments
 * Interface for Payments
 */
export interface Payments {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType number */
  amount?: number;
  /** @wixFieldType date */
  paymentDate?: Date | string;
  /** @wixFieldType text */
  paymentMethod?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType text */
  transactionReference?: string;
}


/**
 * Collection ID: reservations
 * Interface for Reservations
 */
export interface Reservations {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  reservationNumber?: string;
  /** @wixFieldType text */
  guestName?: string;
  /** @wixFieldType text */
  roomNumber?: string;
  /** @wixFieldType date */
  checkInDate?: Date | string;
  /** @wixFieldType date */
  checkOutDate?: Date | string;
  /** @wixFieldType text */
  status?: string;
}


/**
 * Collection ID: rooms
 * @catalog This collection is an eCommerce catalog
 * Interface for HotelRooms
 */
export interface HotelRooms {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  itemName?: string;
  /** @wixFieldType number */
  itemPrice?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  itemImage?: string;
  /** @wixFieldType text */
  itemDescription?: string;
  /** @wixFieldType text */
  roomType?: string;
  /** @wixFieldType number */
  maxOccupancy?: number;
  /** @wixFieldType text */
  roomStatus?: string;
}


/**
 * Collection ID: staff
 * Interface for StaffMembers
 */
export interface StaffMembers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  jobTitle?: string;
  /** @wixFieldType text */
  department?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType time */
  shiftStartTime?: any;
  /** @wixFieldType time */
  shiftEndTime?: any;
}
