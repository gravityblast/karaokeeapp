class Track < ActiveRecord::Base
  attr_accessible :name, :artist
  
  belongs_to :playlist
  
  validates :name, :presence => true
  # validates :presence, :presence => true
  # validates :mxm_id, :presence => true
  # validates :youtube_id, :presence => true  
end
