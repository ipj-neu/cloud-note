import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, StyleSheet, Keyboard } from "react-native"
import { Stack, useLocalSearchParams } from "expo-router";
import {useContext, useState, useEffect, useRef, RefObject} from "react"
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/base";
import { domain } from "@/constants/Domain";
import { Auth } from "aws-amplify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "@/contexts/NoteProvider";

const NoteScreen = () => {
    const {noteId} = useLocalSearchParams()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [changed, setChanged] = useState(false)

    useEffect(() => {
        if (noteId === "new") {
            setTitle("New Note")
            setContent("New Note")
            setChanged(true)
        } else {
            AsyncStorage.getItem("notes")
                .then((data) => {
                    if (data) {
                        const notes: Note[] = JSON.parse(data)
                        const note = notes.find((note) => note.noteId === noteId)
                        if (note) {
                            setTitle(note.title)
                            setContent(note.note)
                        }
                    }
                })
        }
    }, [])

    const changeTitle = (text: string) => {
        if (!changed) {
            setChanged(true)
        }
        setTitle(text)
    }

    const changeContent = (text: string) => {
        if (!changed) {
            setChanged(true)
        }
        setContent(text)
    }

    const updateNotes = async () => {
        const res = await fetch(`${domain}/note`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + (await Auth.currentSession()).getAccessToken().getJwtToken()
            }
        })
        const notes = await res.json()
        await AsyncStorage.setItem(
            "notes",
            JSON.stringify(notes)
        )
    }

    const save = async () => {
        console.log("saving...")
        Keyboard.dismiss()
        setChanged(false)
        const res = await fetch(`${domain}/note/${noteId}`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + (await Auth.currentSession()).getIdToken().getJwtToken()
            },
            body: JSON.stringify({
                title: title,
                note: content
            })
        })
        console.log(res.status)
        updateNotes()
    }

    return (
        <View style={{flex: 1}}>
            <Stack.Screen options={{
                title: title,
                headerBackTitleVisible: false
            }}/>
            <ScrollView keyboardDismissMode="on-drag" automaticallyAdjustKeyboardInsets style={{flex: 1}} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll={true} scrollEventThrottle={1}>
                <View>
                    <TextInput style={{backgroundColor: "black", color: "white", padding: 10, fontSize: 40}} value={title} onChangeText={changeTitle} />
                    <View style={{backgroundColor: "#666", height: 2}}></View>
                </View>
                <TextInput multiline style={{flex: 1, color: "white", fontSize: 20, padding: 5}} value={content} onChangeText={changeContent} />
                <SafeAreaView style={{height: 120}}></SafeAreaView>
            </ScrollView>
            {changed && (
                <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="position" contentContainerStyle={style.save} style={{bottom: 30}}>
                    <TouchableOpacity style={style.touchable} onPress={save}>
                        <Icon name="save" type="feather" size={40} />
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            )}
        </View>
    );
}

const style = StyleSheet.create({
    save: {
        zIndex: 1, 
        position: "absolute", 
        right: 30
    },
    saveText: {
        fontSize: 30,
        paddingHorizontal: 50
    },
    touchable: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#9368B7", 
        height: 60, 
        width: 60,
        borderRadius: 100
    }
})

export default NoteScreen