import React from "react";
import axios from 'axios';

import { withSnackbar } from 'notistack';
import Tooltip from '@material-ui/core/Tooltip';

class UserProfilePicUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFileUploaded: false
    };
  }
  readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })
  }
  handleImageChange = async e => {
    e.preventDefault();
    try {
      let file = e.target.files[0];
      const base64File = await this.readFileAsync(file);
      const response = await axios.patch(`/users/${localStorage.getItem('userId')}`, {"profile_pic": base64File});
      if(response.data.success) {
        this.setState({isFileUploaded: true});
        this.props.changeUserProfilePic(base64File);
        this.props.enqueueSnackbar("Avatar has been successfully changed", {variant: 'success'});
      }
    } catch (error) {
      console.error(error);
    }
  }
  render() {
    return (
      <div>
        <Tooltip
          title="Select image"
          placement="bottom"
        >
          <div className="picture-container">
            <div className="picture" style={{margin: 0}}>
              <img
                src={this.props.user.profile_pic}
                className="picture-src"
                alt="..."
              />
              <input type="file" onChange={e => this.handleImageChange(e)} />
            </div>
          </div>
        </Tooltip>
      </div>
    );
  }
}

export default withSnackbar(UserProfilePicUpload);
