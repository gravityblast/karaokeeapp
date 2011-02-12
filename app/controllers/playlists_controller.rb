class PlaylistsController < ApplicationController
  def index
    @playlists = current_user.playlists.paginate(:per_page => 10, :page => params[:page], :order => 'id DESC')
  end
  
  def new    
  end
  
  def create
    @playlist = current_user.playlists.build(params[:playlist])
    if @playlist.save
      flash[:notice] = 'Playlist created successfully'
      redirect_to playlists_path
    else
      flash.now[:error] = 'Problem saving the playlist'
      render :action => 'new'
    end
  end
  
  def show
    @playlist = current_user.playlists.find(params[:id], :include => :tracks)
  end

  def destroy
    @playlist = current_user.playlists.find(params[:id])
    @playlist.destroy

    redirect_to playlists_path
  end

end
