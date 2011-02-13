module TracksHelper
  def formatted_lyrics_body(mxm_lyrics)
    html = ""
    mxm_lyrics.lyrics_body.split(/[\n\r]+/).each_with_index do |line, index|
      html << %|<p class="line line-#{index + 1}">#{line}</p>|
    end
    html.html_safe
  end
end
