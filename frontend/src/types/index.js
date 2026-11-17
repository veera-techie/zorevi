/**
 * JSDoc Type Definitions for Zorevi Studio Data Models
 *
 * @typedef {Object} DesignerProfile
 * @property {string} id
 * @property {string} name
 * @property {string} title
 * @property {string} location
 * @property {string} serviceRadius
 * @property {string} experience
 * @property {number} rating
 * @property {number} reviewCount
 * @property {number} profileCompletion
 * @property {boolean} isOnline
 * @property {string[]} specializations
 *
 * @typedef {Object} Booking
 * @property {string} id
 * @property {Object} customer
 * @property {string} customer.name
 * @property {string} customer.avatar
 * @property {string} service
 * @property {string} dateTime
 * @property {number} amount
 * @property {'Pending' | 'Accepted' | 'Upcoming' | 'Completed' | 'Cancelled'} status
 */

export const BookingStatus = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  UPCOMING: 'Upcoming',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};
