const clientId = 'd571c3e1eea0434bbd2f9855250baf11';
const redirectUri = 'http://localhost:3000';

let accessToken;

const Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken
        }

        //check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch){

            console.log('something wrong here')

            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //clear the parameter and grab new access token when expired
            window.setTimeout(() => {
                accessToken = ''
            }, expiresIn * 1000);
            window.history.pushState('Access Token', null, '/')
            return accessToken;
        }else{
            const spotifyURL = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientId}&redirect_uri=${redirectUri}`;
            window.location = spotifyURL;
        }
    },

    search(term){
        const accessToken = Spotify.getAccessToken();
        const searchURL = `https://api.spotify.com/v1/search?type=track&q=${term}`;

        return fetch(searchURL, {
            method: 'GET',
               headers: {
              Authorization: `Bearer ${accessToken}`
            }
        })
        .then(response=>response.json())
        .then(jsonResponse=>{
            if(!jsonResponse.tracks){
                return []
            }
            return jsonResponse.tracks.items.map(track=>({
                id: track.id,
                name: track.name,
                artists: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })
    },

    savePlaylist(name, trackURIs) {
        if(!name || !trackURIs || trackURIs.length === 0){
            return 
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` }
        let userId;
        const userURL = `https://api.spotify.com/v1/me`;
        return fetch(userURL, { headers: headers })
        .then(response=> response.json())
        .then(jsonResponse=>{
            userId = jsonResponse.id;
            const creatPlaylistURL = `https://api.spotify.com/v1/users/${userId}/playlists`
            return fetch(creatPlaylistURL),{
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name:name })
                .then(response=>response.json())
                .then(jsonResponse=>{
                    const playlistId = jsonResponse.id
                    const addPlaylistTracksUrl =`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
                    return fetch(addPlaylistTracksUrl,{
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({uris: trackURIs})
                    })
                })
            }
        })
    }
}

export default Spotify;