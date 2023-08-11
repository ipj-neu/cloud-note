import { Link, Stack, useFocusEffect } from "expo-router";
import { Text, View, StyleSheet, Pressable, FlatList, TouchableOpacity } from "react-native"
import { Note } from "@/contexts/NoteProvider";
import { useContext, useEffect, useState } from "react";
import { Icon } from "@rneui/base";
import { Swipeable } from "react-native-gesture-handler";
import { Auth } from "aws-amplify";
import { domain } from "@/constants/Domain";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthenticator } from "@aws-amplify/ui-react-native";

const RenderDelete = ({noteId}: {noteId: string}) => {

    // change to remove for change state and update async storage to avoid another request

    const deleteNote = async () => {
        const res = await fetch(`${domain}/note/${noteId}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + (await Auth.currentSession()).getIdToken().getJwtToken()
            }
        })
        console.log(res.status)
    }

    return (
        <TouchableOpacity style={style.delete} onPress={deleteNote}>
            <Icon color="white" name="delete-outline" type="material" size={40} />
        </TouchableOpacity>
    )    
}

const ListItem = ({note}: {note: Note}) => {
    return (
        <Swipeable renderRightActions={() => <RenderDelete noteId={note.noteId} />}>
            <Link href={`/note/${note.noteId}`} asChild>
                <Pressable style={style.item}>
                    <Text style={style.title}>{note.title}</Text>
                    <Text numberOfLines={1} style={style.content}>{note.note}</Text>
                </Pressable>
            </Link>
        </Swipeable>
    );
}

const Logout = ({signOut}: {signOut: () => void}) => {
    return (
        <TouchableOpacity onPress={signOut}>
            <Icon color="white" name="logout" type="simple-line-icon" />
        </TouchableOpacity>
    )
}

const NoItems = () => (
    <View style={{justifyContent: "center", alignItems: "center", marginVertical: 50}}>
        <Text style={{color: "#555", fontSize: 30}}>No Notes</Text>
    </View>
)

const MainPage = () => {
    const {signOut} = useAuthenticator()
    const [notes, setNotes] = useState<Note[]>([])
    const [loading, setLoading] = useState(false)

    const updateNotes = async () => {
        setLoading(true)
        const res = await fetch(`${domain}/note`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + (await Auth.currentSession()).getIdToken().getJwtToken()
            }
        })
        const notes = await res.json()
        // console.log(notes)
        await AsyncStorage.setItem(
            "notes",
            JSON.stringify(notes)
        )
        setNotes(notes)
        setLoading(false)
    }

    useEffect(() => {
        updateNotes()
    }, [])

    return (
        <View style={{flex: 1, backgroundColor: "#0D0630"}}>
            <Stack.Screen 
                options={{
                    title: "Notes",
                    headerRight: () => <Logout signOut={signOut} />
                }}
            />
            <FlatList 
                refreshing={loading} 
                onRefresh={updateNotes} 
                renderItem={({ item }) => <ListItem note={item}/>} 
                data={notes} 
                ListFooterComponent={() => <View style={{height: 120}}></View>} 
                ListHeaderComponent={() => <View style={{height: 10}}></View>} 
                ListEmptyComponent={NoItems}
            />
            <Link href="/note/new" asChild>
                <TouchableOpacity style={style.touchable}>
                    <Icon name="note-add" size={45} />
                </TouchableOpacity>
            </Link>
        </View>
    )
}


export default MainPage;

const style = StyleSheet.create({
    item: {
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: "#AA3E98",
        borderRadius: 5,
        padding: 5
    },
    title: {
        color: "#fff",
        fontSize: 25,
        fontWeight: "500",
        marginBottom: 10
    },
    content: {
        color: "#fff",
        fontSize: 18,
        marginBottom: 5
    },
    touchable: {
        flex: 1,
        position: "absolute",
        zIndex: 1,
        bottom: 30,
        right: 30,
        backgroundColor: "#9368B7", 
        height: 60, 
        width: 60,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    plus: {
        fontSize: 50,
        fontWeight: "bold"
    },
    delete: {
        justifyContent: "center",
        marginVertical: 5,
        alignItems: "center",
        backgroundColor: "#ff6666",
        width: 60,
        borderRadius: 5,
        marginRight: 10
    }
})