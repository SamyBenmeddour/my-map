import {Address} from '../../model/Address';

export class ApiAddress {

  numRue: number;
  suffixeRue: string;
  typeRue: string;
  nomRue: string;
  ville: string;
  formattedAddress: string;
  indexRue: number;
  indexLoc: number;

  public static toAddress(apiAddress: ApiAddress): Address {
    const item = new Address();
    item.number = apiAddress.numRue;
    item.type = apiAddress.typeRue;
    item.city = apiAddress.ville;
    item.formatted = apiAddress.formattedAddress;
    item.name = apiAddress.nomRue;
    return item;
  }

}
