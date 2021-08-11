import React from 'react';
import TrackList from '../TrackList/TrackList';

import './Playlist.css';


class Playlist extends React.Component {
    constructor (props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this)
    }

    handleNameChange(e){
        this.props.onChangeName(e.target.value)
    }



    render () {
        return (
            <div className="Playlist">
                <input  defaultValue={this.props.playlistName} onChange={this.handleNameChange} />

                <TrackList tracks={this.props.playlistTracks} 
                           isRemoval={true} 
                           onRemove={this.props.onRemove}
                
                />

                <button className="Playlist-save"  >SAVE TO SPOTIFY</button>
            </div>
        );
    }
}

export default Playlist;

// onClick={() => window.location.reload(true)}