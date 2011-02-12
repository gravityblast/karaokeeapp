class TracksController < ApplicationController
  before_filter :find_playlist
  
  def create
    @track = @playlist.tracks.build(params[:track])
    if @track.save
      flash[:notice] = 'Track added successfully'      
    else
      flash[:error] = 'Problem adding track'
    end
    
    redirect_to playlist_path(@playlist)
  end
  
  def destroy
    @track = @playlist.tracks.find(params[:id])
    @track.destroy
    redirect_to playlist_path(@playlist)
  end
  
  def search
    @tracks_result = MusixMatch.search_track(:q => params[:q])
    render :layout => false
    # render :json => @tracks_result.track_list.to_json
  end
  
protected

  def find_playlist
    @playlist = current_user.playlists.find(params[:playlist_id])
  end
end
