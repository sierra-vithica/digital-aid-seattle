'use client'
import { useState } from 'react'

export default function Home () {

  // Get today's date, so we can default to that for our Donation Date
  const date = new Date()
  const year = date.toLocaleString('default', { year: 'numeric' })
  const month = date.toLocaleString('default', { month: '2-digit' })
  const day = date.toLocaleString('default', { day: '2-digit' })

  // Set up our donation types
  const donationTypes = [
    'Money',
    'Food',
    'Clothing'
  ]

  // Set up our initial form state
  const initial_form_state = {
    donorName: '',
    donationType: donationTypes[0],
    donationAmount: '',
    donationQty: '',
    donationDate: year + '-' + month + '-' + day
  }

  // Set up our state
  const [donationListId, setDonationListId] = useState(0)
  const [currentDonationListId, setCurrentDonationListId] = useState(0)
  const [donationList, setDonationList] = useState({})
  const [donationFormData, setDonationFormData] = useState(initial_form_state)
  const [donationTypeFilter, setDonationTypeFilter] = useState('all')

  // Reset the Donation Form by setting the current donation list id to the donation list id and resetting the form data
  const resetForm = () => {
    setCurrentDonationListId(donationListId)
    setDonationFormData({
      ...initial_form_state,
    })
  }

  // Handle the Donation form submission
  const handleSubmit = (formData) => {
    // Get the form data from the form submission
    const donorName = formData.get('donorName')
    const donationType = formData.get('donationType')
    const donationAmount = formData.get('donationAmount')
    const donationQty = formData.get('donationQty')
    const donationDate = formData.get('donationDate')

    // Create our form data object with the values from the form submission
    const form_data = {
      donorName,
      donationType,
      donationDate
    }

    // If the donation type is Money, add the donation amount to the form data, otherwise add the donation quantity
    if (donationType === 'Money') {
      form_data.donationAmount = parseFloat(donationAmount).toFixed(2)
    } else {
      form_data.donationQty = parseInt(donationQty)
    }

    // Add the form data to the donation list
    setDonationList({
      ...donationList,
      [currentDonationListId]: form_data
    })

    // If we're adding a new donation, increment the donation list id and set the current donation list id to the donation list id
    if (currentDonationListId === donationListId) {
      setDonationListId(donationListId + 1)
      setCurrentDonationListId(donationListId + 1)
    }

    // If we're editing an existing donation, set the current donation list id to the donation list id
    else {
      setCurrentDonationListId(donationListId)
    }

    // Reset the form data
    setDonationFormData({
        ...initial_form_state,
      }
    )
  }

  // Handle deleting a donation by removing it from the donation list
  const handleDelete = (donationListId) => {
    const updatedDonationList = { ...donationList }
    delete updatedDonationList[donationListId]
    setDonationList(updatedDonationList)
  }

  // Handle editing a donation by setting the form data to the donation we want to edit
  const handleEdit = (donationListId) => {
    const donation = donationList[donationListId]
    setDonationFormData({
      donorName: donation.donorName,
      donationType: donation.donationType,
      donationAmount: donation.donationAmount,
      donationQty: donation.donationQty,
      donationDate: donation.donationDate,
      donationListId
    })
    setCurrentDonationListId(donationListId)
  }

  // Get the filtered donation list based on the donation type filter
  const getFilteredDonationList = () => {
    return Object.keys(donationList).filter((donationListId) => {
        const donation = donationList[donationListId]
        if (donationTypeFilter === 'all') {
          return true
        }
        return donation.donationType === donationTypeFilter
      }
    ).map((donationListId) => {
        const donation = donationList[donationListId]
        return (
          <li key={donationListId} className="py-4 border-b border-b-1">
            <p>
              <strong>Name: </strong>
              {donation.donorName}
            </p>
            <p>
              <strong>Type: </strong>
              {donation.donationType}
            </p>
            {donation.donationType === 'Money' && (
              <p>
                <strong>Amount: </strong>
                ${donation.donationAmount}
              </p>
            )}
            {donation.donationType !== 'Money' && (
              <p>
                <strong>Qty: </strong>
                {donation.donationQty}
              </p>
            )}
            <p>
              <strong>Date: </strong>
              {donation.donationDate}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => handleDelete(donationListId)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit">Delete
              </button>

              <button
                onClick={() => handleEdit(donationListId)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit">Edit
              </button>
            </div>
          </li>
        )
      }
    )
  }

  // Render the page
  return (
    <main className="p-8">
      <div className="grid grid-cols-4 bg-white p-12">
        {/* Donation List */}
        <div className="col-span-1 p-4">
          <h3 className="text-2xl mb-8 underline underline-offset-4">Donation List</h3>

          {/* Donation Type Filter */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="donationTypeFilter">
              Donation Type Filter
            </label>
            <select
              value={donationTypeFilter}
              onChange={(event) => {
                setDonationTypeFilter(event.target.value)
              }}
              required
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              name="donationTypeFilter">
              <option value="all">All</option>
              {donationTypes.map((donationType) => {
                return (
                  <option key={donationType} value={donationType}>{donationType}</option>
                )
              })}
            </select>
          </div>

          <ul>
            {getFilteredDonationList().length > 0 ? getFilteredDonationList() : 'No donations with these filters.'}
          </ul>
        </div>
        {/* Donation Form */}
        <div className="col-span-2 p-4">
          <h3 className="text-2xl mb-8 underline underline-offset-4">Donation Form
            ({currentDonationListId === donationListId ? 'Adding' : 'Editing'})</h3>
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" action={handleSubmit}>

            {/* Donor Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="donorName">
                Donor Name
              </label>
              <input
                value={donationFormData.donorName}
                onChange={(event) => {
                  setDonationFormData({
                    ...donationFormData,
                    donorName: event.target.value
                  })
                }}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text" name="donorName" required placeholder="Full Name" />
            </div>

            {/* Donation Type */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="donationType">
                Donation Type
              </label>
              <select
                value={donationFormData.donationType}
                onChange={(event) => {
                  setDonationFormData({
                    ...donationFormData,
                    donationType: event.target.value
                  })
                }}
                required
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                name="donationType">
                {donationTypes.map((donationType) => {
                  return (
                    <option key={donationType} value={donationType}>{donationType}</option>
                  )
                })}
              </select>
            </div>

            {/* Donation Amount */}
            {donationFormData.donationType === 'Money' && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="donationAmount">
                  Donation Amount
                </label>
                <input
                  value={donationFormData.donationAmount ?? 0}
                  onChange={(event) => {
                    setDonationFormData({
                      ...donationFormData,
                      donationAmount: event.target.value
                    })
                  }}
                  step="0.01"
                  min="0"
                  type="number"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="donationAmount" required placeholder="Donation Amount" />
              </div>
            )}

            {/* Donation Quantity */}
            {donationFormData.donationType !== 'Money' && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="donationQty">
                  Donation Quantity
                </label>
                <input
                  value={donationFormData.donationQty ?? 0}
                  onChange={(event) => {
                    setDonationFormData({
                      ...donationFormData,
                      donationQty: event.target.value
                    })
                  }}
                  min="0"
                  type="number"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  name="donationQty" required placeholder="Donation Quantity" />
              </div>
            )}

            {/* Donation Date */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="donationDate">
                Donation Date
              </label>
              <input
                value={donationFormData.donationDate}
                onChange={(event) => {
                  setDonationFormData({
                    ...donationFormData,
                    donationDate: event.target.value
                  })
                }}
                type="date"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                name="donationDate" required placeholder="Donation Quantity" />
            </div>

            {/* Donation Submit */}
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit">Submit
              </button>
              <button
                onClick={resetForm}
                className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button">Reset
              </button>
            </div>
          </form>
        </div>
        {/* Donation Stats */}
        <div className="col-span-1 p-4">
          <h3 className="text-2xl mb-8 underline underline-offset-4">Donation Stats</h3>

          <div className="mb-4">
            <strong>Total Donations: </strong>
            {Object.keys(donationList).length}
          </div>

          <div className="mb-4">
            <strong>Total Donation Amount: </strong>
            ${Object.keys(donationList).reduce((total, donationListId) => {
            const donation = donationList[donationListId]
            if (donation.donationType === 'Money') {
              return total + parseFloat(donation.donationAmount)
            }
            return total
          }, 0).toFixed(2)}
          </div>
        </div>
      </div>
    </main>
  )
}
