const titleProperties = {
  'general.person': [
    'general.lastname',
    'general.firstname'
  ],
  'general.location': [
    'general.address'
  ],
  'general.case': [
    'publicsafety.case'
  ],
  'sample.person2': [
    'general.lastname',
    'general.firstname'
  ],
  'sample.bookings2': [
    'publicsafety.datebooked2'
  ],
  'nc.PersonType': [
    'nc.PersonSurName',
    'nc.PersonGivenName'
  ],
  'publicsafety.GangType': [
    'publicsafety.GangName'
  ],
  'general.LocationType': [
    'nc.LocationCityName',
    'nc.LocationStateName'
  ],
  'j.WarrantType': [
    'j.WarrantLevelText'
  ],
  'j.ServiceCallType': [
    'publicsafety.CadEventNumber'
  ],
  'j.BookingType': [
    'publicsafety.CustodyID',
    'j.SubjectBooking'
  ],
  'j.ChargeType': [
    'j.ArrestCharge',
    'publicsafety.datereleased2'
  ]
};

function getFqn(edmObj) {
  return `${edmObj.type.namespace}.${edmObj.type.name}`;
}

function getFormattedRow(row, propertyTypes) {
  if (Object.keys(row)[0].includes('.')) return row;
  const convertedRow = {};
  propertyTypes.forEach((propertyType) => {
    if (row[propertyType.id]) convertedRow[getFqn(propertyType)] = row[propertyType.id];
  });
  return convertedRow;
}

export default function getTitle(entityType, row, propertyTypes) {
  const formattedRow = getFormattedRow(row, propertyTypes);
  const titleProps = titleProperties[getFqn(entityType)];
  if (titleProps) {
    const titleValues = titleProps.map((propertyTypeFqn) => {
      return formattedRow[propertyTypeFqn];
    });
    if (titleValues.length) return titleValues.join(', ');
  }
  return `[${entityType.title}]`;
}