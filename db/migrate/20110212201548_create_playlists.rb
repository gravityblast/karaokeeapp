class CreatePlaylists < ActiveRecord::Migration
  def self.up
    create_table :playlists do |t|
      t.integer :user_id
      t.string :name

      t.timestamps
    end
    
    add_index :playlists, :user_id
  end

  def self.down
    drop_table :playlists
  end
end
