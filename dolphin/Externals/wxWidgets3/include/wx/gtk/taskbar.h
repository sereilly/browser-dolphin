///////////////////////////////////////////////////////////////////////////////
// Name:        wx/gtk/taskbar.h
// Purpose:     wxTaskBarIcon class for GTK2
// Author:      Paul Cornett
// Created:     2009-02-08
// RCS-ID:      $Id: taskbar.h 67232 2011-03-18 15:10:15Z DS $
// Copyright:   (c) 2009 Paul Cornett
// Licence:     wxWindows licence
///////////////////////////////////////////////////////////////////////////////

#ifndef _WX_GTK_TASKBARICON_H_
#define _WX_GTK_TASKBARICON_H_

class WXDLLIMPEXP_ADV wxTaskBarIcon: public wxTaskBarIconBase
{
public:
    wxTaskBarIcon();
    ~wxTaskBarIcon();
    virtual bool SetIcon(const wxIcon& icon, const wxString& tooltip = wxString());
    virtual bool RemoveIcon();
    virtual bool PopupMenu(wxMenu* menu);
    bool IsOk() const { return true; }
    bool IsIconInstalled() const;

    class Private;

private:
    Private* m_priv;

    DECLARE_DYNAMIC_CLASS(wxTaskBarIcon)
    DECLARE_NO_COPY_CLASS(wxTaskBarIcon)
};

#endif // _WX_GTK_TASKBARICON_H_
