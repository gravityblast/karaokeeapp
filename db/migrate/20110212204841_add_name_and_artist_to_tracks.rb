class AddNameAndArtistToTracks < ActiveRecord::Migration
  def self.up
    add_column :tracks, :name, :string
    add_column :tracks, :artist, :string
  end

  def self.down
    remove_column :tracks, :artist
    remove_column :tracks, :name
  end
end
