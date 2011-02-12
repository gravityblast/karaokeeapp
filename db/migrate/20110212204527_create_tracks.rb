class CreateTracks < ActiveRecord::Migration
  def self.up
    create_table :tracks do |t|
      t.integer :playlist_id
      t.integer :mxm_id
      t.string :youtube_id
      t.text :lrc

      t.timestamps
    end
    
    add_index :tracks, :playlist_id
  end

  def self.down
    drop_table :tracks
  end
end
