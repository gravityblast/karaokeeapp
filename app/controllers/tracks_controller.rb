class TracksController < ApplicationController
  before_filter :find_playlist
  
  def show
    @track = @playlist.tracks.find(params[:id])
    @mxm_lyrics_result = MusixMatch.get_lyrics(@track.mxm_id)
    @mxm_lyrics = @mxm_lyrics_result.lyrics if @mxm_lyrics_result
  end
  
  def edit
    @track = @playlist.tracks.find(params[:id])
    @mxm_lyrics_result = MusixMatch.get_lyrics(@track.mxm_id)
    @mxm_lyrics = @mxm_lyrics_result.lyrics if @mxm_lyrics_result
  end
  
  def create
    mxm_track_result  = MusixMatch.get_track(params[:mxm_id])
    mxm_lyrics_result = MusixMatch.get_lyrics(params[:mxm_id])
    mxm_track = mxm_track_result.track
    mxm_lyrics = mxm_lyrics_result.lyrics
    if mxm_track && mxm_lyrics
      @track = @playlist.tracks.build
      @track.mxm_id = mxm_track.track_id
      @track.name = mxm_track.track_name
      @track.artist = mxm_track.artist_name
      if @track.save
        flash[:notice] = 'Track added successfully'
        redirect_to edit_playlist_track_path(@playlist, @track)
      else
        flash[:error] = 'Problem adding track'
        redirect_to playlist_path(@playlist)
      end
    else
      flash[:error] = 'Problem adding track'
      redirect_to playlist_path(@playlist)
    end        
  end
  
  def destroy
    @track = @playlist.tracks.find(params[:id])
    @track.destroy
    redirect_to playlist_path(@playlist)
  end
  
  def search
    @tracks_result = MusixMatch.search_track(:q => params[:q], :f_has_lyrics => 1)
    render :layout => false
    # render :json => @tracks_result.track_list.to_json
  end
  
  def update
    @track = @playlist.tracks.find(params[:id])
    @track.youtube_id = params[:video_id]
    @track.lrc = params[:lrc]
    @track.save
    render :nothing => true
  end
  
protected

  def find_playlist
    @playlist = current_user.playlists.find(params[:playlist_id])
  end
end
