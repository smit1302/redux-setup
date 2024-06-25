import { service } from "utils/Service/service";
import View from "common/View";

class UserData {
  constructor(

    readonly company_id?: number,
    readonly user_type?: string,
    readonly name?: string,
    readonly email?: string,
    readonly contact_number?: string,
    readonly is_active?: boolean,
    readonly im_type_?: string,
    readonly title?: string,
    readonly address1?: string,
    readonly address2?: string,
    readonly city?: string,
    readonly state?: string,
    readonly country?: string,
    readonly zip?: string,
    readonly im_id?: string,
    readonly im_name?: string,
    // readonly im_id?: string,
    readonly linkedin?: string,
    readonly facebook?: string,
    readonly twitter?: string,
    readonly blog?: string,
    readonly birth_date?: string,
    readonly anniversary?: string,
    readonly qualification?: string,
    readonly experience?: string,
  ) { }
}

const Profile = () => {
  const viewType = Object.keys(new UserData());
  return (
    <>
      <View url={service.API_URL.profile.getSystemUser} display={'Profile'} viewType={viewType} editUrl={"/edit-profile"} />
    </>
  );
}


export default Profile;
