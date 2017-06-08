function evalMessageTreeScripts( respText )
{
    // NOTE: this was assuming that the script block that contains the message count
    // updating code is the last one in the HTML returned for the tree
    // BUT when the cloud is on (or at least the sample-social-learning fake-cloud)
    // then there are more script blocks making the one we want "not the last".
    // Instead, look for the specific block we care about and execute it.
    // TODO: I'm not sure what the cloud is expecting to have executed in this context
    // so the cloud team needs to test whatever they're adding to the discussion board
    // and maybe just have this block execute ALL script blocks instead of just the one we care about.
    var scripts = respText.extractScripts("script");
    for (var i=0;i<scripts.length;i++)
    {
      if (scripts[i].indexOf("updateMessageCounts") !== -1)
      {
        // update the total/unread counts and the timespan since post/edit time for all the messages in the tree. see message_tree.jsp
        eval( scripts[i] );
      }
    }
}